import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'password không được để trống' })
  password: string;

  @IsOptional()
  name: string;
}

export class CodeAuthDto {
  @IsNotEmpty({ message: 'email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'code không được để trống' })
  code: string;
}

export class ChangePasswordAuthDto {
  @IsNotEmpty({ message: 'code không được để trống' })
  code: string;

  @IsNotEmpty({ message: 'password không được để trống' })
  password: string;

  @IsNotEmpty({ message: 'confirmPassword không được để trống' })
  confirmPassword: string;

  @IsNotEmpty({ message: 'email không được để trống' })
  email: string;
}

export class ChangePasswordProfileDto {
  @IsNotEmpty({ message: 'Mật khẩu cũ không được để trống' })
  oldPassword: string;

  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  password: string;

  @IsNotEmpty({ message: 'Vui lòng nhập lại mật khẩu mới' })
  confirmPassword: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;
}
