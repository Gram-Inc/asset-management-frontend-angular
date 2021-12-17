import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "replaceUndefiendWithText",
})
export class ReplaceUndefiendWithTextPipe implements PipeTransform {
  transform(value: any, replaceText: string = "N/A"): any {
    if (value == undefined || value == null) return replaceText;
    return value;
  }
}
