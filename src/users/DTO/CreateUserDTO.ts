import {
  Equals,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'O nome deve conter apenas letras' })
  name: string;

  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória' })
  @MinLength(6, {
    message: 'A confirmação de senha deve ter no mínimo 6 caracteres',
  })
  @Equals('password', { message: 'As senhas não coincidem' })
  confirmPassword: string;

  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'A data de nascimento deve estar no formato AAAA-MM-DD',
  })
  dateBirth: string;

  @IsNotEmpty({ message: 'Documento é obrigatório' })
  @IsString({ message: 'O documento deve conter apenas números e letras' })
  documentId: string;
}
