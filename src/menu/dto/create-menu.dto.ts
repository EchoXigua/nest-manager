import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  ValidateIf,
} from 'class-validator';
//这个包会帮助我们校验，不通过会返回报错信息和状态码
//为什么不定义接口，而定义类？虽然都可以对类型进行约束
/**
 * 类是 JavaScript ES6 标准的一部分，因此它们在编译后的 JavaScript 中被保留为实际实体。
 * 另一方面，由于 TypeScript 接口在转换过程中被删除，所以 Nest 不能在运行时引用它们。
 * 这一点很重要，因为诸如管道（Pipe）之类的特性为在运行时访问变量的元类型提供更多的可能性。
 */
export class CreateMenuDto {
  @IsNotEmpty({
    message: '必传',
  })
  title: string;

  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  menuType: string;

  // @IsUUID(undefined,{ always: true,message: '上级菜单id格式不正确' })
  // @ValidateIf((value) => value.parent !== null && value.parent)
  @IsOptional()
  @Transform(({ value }) => {
    return value == '' ? '0' : value;
  })
  pid: string | '0';
}
