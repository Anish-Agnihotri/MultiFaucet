import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class Network {
  @IsString()
  chainId: string;

  @IsNotEmpty()
  @IsString()
  faucetContractAddress: string;

  @IsNotEmpty()
  @IsString()
  rpc: string;
}

export class CreateNetworkDto {
  @IsNotEmpty()
  @IsString()
  key: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => Network)
  networks: Network[];
}

export class UpdateNetworkDto extends CreateNetworkDto {}
