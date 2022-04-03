import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsString,
  IsUrl,
} from 'class-validator';

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
  @IsUrl(undefined, {
    each: true,
    message: ' portfolioUrl is not valid.',
  })
  portfolioUrl: string[];

  @IsUrl(undefined, { message: ' URL is not valid.' })
  url: string;
}
