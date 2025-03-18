import { ValidationError } from 'class-validator';

export class ErrorExtractor {
	private deepestErrors: { property: string; messages: string[] }[] = [];

	public extractDeepestErrors(errors: ValidationError[]): { property: string; messages: string[] }[] {
		this.deepestErrors = [];
		errors.forEach(error => this.traverse(error));
		return this.deepestErrors;
	}

	private traverse(error: ValidationError, currentPath: string = ''): void {
		if (error.constraints) {
			this.deepestErrors.push({
				property: `${currentPath}${error.property}`,
				messages: Object.values(error.constraints),
			});
		}
		if (error.children && error.children.length > 0) {
			error.children.forEach(childError => this.traverse(childError, `${currentPath}${error.property}.`));
		}
	}
}
