import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class SuveyInfoDto {
  @IsNotEmpty()
  @IsString()
  position: string;

  @IsObject()
  front: {
    ability: [{ name: string; time: string | number; rate: string | number }];
    skills: [{ name: string; time: string | number; rate: string | number }];
  };

  @IsObject()
  back: {
    ability: [{ name: string; time: string | number; rate: string | number }];
    skills: [{ name: string; time: string | number; rate: string | number }];
  };

  @IsObject()
  design: {
    skills: [{ name: string; time: string | number; rate: string | number }];
  };

  @IsArray()
  portfolioUrl: [];

  url: string;
}
