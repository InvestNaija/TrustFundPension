import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { AGENT_ACCOUNT_TYPE, IAgent } from '../../user/types';

export class AgentRegistrationDto implements Partial<IAgent> {
  // BASIC INFO(s)
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ValidateIf((o) => o.accountType === AGENT_ACCOUNT_TYPE.BUSINESS)
  @IsNotEmpty({ message: 'Company name is required for business accounts' })
  @IsString({ message: 'Company name must be a valid text value' })
  companyName: string;

  @IsNotEmpty()
  @IsEnum(AGENT_ACCOUNT_TYPE)
  accountType: AGENT_ACCOUNT_TYPE;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`-])[A-Za-z\d!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`-]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    },
  )
  password: string;
}
