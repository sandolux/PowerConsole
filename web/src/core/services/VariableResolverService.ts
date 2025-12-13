export class VariableResolverService {
  resolve(template: string, variables: Record<string, string>): string {
    let result = template;
    Object.entries(variables).forEach(([key, value]) => {
      const pattern = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      result = result.replace(pattern, value);
    });
    return result;
  }
}
