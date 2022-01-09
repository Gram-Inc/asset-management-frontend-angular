import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "bytesToGB",
})
export class BytesToGBPipe implements PipeTransform {
  transform(value: any, replace: string = "N/A"): any {
    return Number.parseInt(value) / 1073741824;
  }
}
