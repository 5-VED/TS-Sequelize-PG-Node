import fs from 'fs';
import multer from 'multer';
import os from 'os';
import path from 'path';
import  logger  from '../Config/Logger';


interface IFileResult {
    status: boolean,
    message: string,
    location: string
}


/**
 * If the filepath starts with 'public', remove the prefix.
 * @param {string} filepath The path to be processed.
 * @returns {string} The processed path.
 */
async function removePublicPrefix(filepath: string) {
    if (filepath.startsWith('public')) {
        filepath = filepath.replace(/^.+?[/]/, '');
    }
    return filepath;
}


/**
 * Creates directories for a given file path if they do not exist.
 * @param {string} filepath - The file path for which directories are created.
 * @param {string} [mode='0755'] - The permission mode for the directories.
 * Uses '0755' as default to allow owner to read/write/execute and others to read/execute.
 */
async function createDirectories(filepath: string, mode = '0755') {
    const matchedPath = filepath.match(/(.*)[\\/\\]/);
    const dirname = matchedPath ? matchedPath[1] : '';
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true, mode: mode });
    }
}

/**
 * Creates directories for a given file path if they do not exist.
 * @param {string} filepath - The file path for which directories are created.
 * @param {string} [mode='0755'] - The permission mode for the directories.
 * Uses '0755' as default to allow owner to read/write/execute and others to read/execute.
 */
export async function createDirectoriesForUpload(filepath: string, mode = '0755') {
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath, { recursive: true, mode: mode });
    }
}

    /**
     * Writes data to a specified file path.
     * @param {string} filepath The path to write the data to.
     * @param {any} data The data to write.
     * @param {string} [mode='0755'] The permission mode for the created directories.
     * @returns {Promise<IFileResult>} A promise that resolves with the location of the written file and other information.
     */
export async function writeDataToFilepath(filepath: string, data: any, mode = '0755'): Promise<IFileResult> {
    try {
        filepath = filepath.replace('\\', '/');
        await createDirectories(filepath, mode);
        fs.writeFileSync(filepath, data, { mode: mode }); //

        filepath = await removePublicPrefix(filepath);
        return { status: true, location: filepath, message: '' };
    } catch (err) {
        logger.error('Unable to create report file: ', [err]);
        return { status: false, location: '', message: 'Unable to create report file' };
    }
}

    /**
     * Writes an array of data to a specified file path.
     * @param {string} filepath The path to write the data to.
     * @param {any[]} data The data to write as an array.
     * @param {string} [mode='0755'] The permission mode for the created directories.
     * @returns {Promise<IFileResult>} A promise that resolves with the location of the written file and other information.
     */
export async function writeArrayToFilepath(filepath: string, data: any, mode = '0755'): Promise<IFileResult> {
    try {
        filepath = filepath.replace('\\', '/');
        await createDirectories(filepath, mode);
        fs.writeFileSync(filepath, data.join(os.EOL), { mode: mode });

        filepath = await removePublicPrefix(filepath);
        return { status: true, location: filepath, message: '' };
    } catch (err) {
        logger.error('Unable to create report file: ', [err]);
        return { status: false, location: '', message: 'Unable to create report file' };
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function uploadFile(filePath: string, fields: any[], req: any, res: any, callback: (err?: any) => void = () => {}) {
    const storage = multer.diskStorage({
        destination: (req: any, file: any, cb: any) => {
            cb(null, filePath);
        },
        filename: (req: any, file: any, cb: any) => {
            cb(null, file.fieldname + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
        },
    });

    const upload = multer({ storage: storage }).fields(fields);
    upload(req, res, async (err: any) => {
        if (err) {
            logger.debug('err', err);
            callback(err);
        } else {
            callback();
        }
    });
}

/**
 * Returns a temporary directory path for uploading files
 * @param {string} facilityId - The ID of the facility
 * @param {string} fileDir - The directory to upload the file to
 * @returns {string} The temporary directory path
 */
export function getDirectoryToUpload(facilityId: string, fileDir: string) {
    const base = path.join('upload', facilityId, fileDir);
    return path.join(os.tmpdir(), base);
}
