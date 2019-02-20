import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nullFilter'
})
export class NullFilterPipe implements PipeTransform {

  transform(value: Object, args: string): String {
    if (value) {
      if (args == "verify_msg") {
        if (value[args] != "success" && value[args] != "pending") {
          return value[args] + " 请从新上传";
        }
      }
      return value[args];
    } else {
      return null;
    }
  }


}
