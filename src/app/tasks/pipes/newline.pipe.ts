import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newline'
})
export class NewlinePipe implements PipeTransform {

  transform(value: string, ...args: string[]): unknown {
    return value.replace(/(?:\r\n|\r|\n)/g, '<br />');
  }

}
