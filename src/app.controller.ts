import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { IsUrl } from 'class-validator';
import parse from 'node-html-parser';
import { AppService } from './app.service';

export class PaginationRequestDto {
  @IsUrl()
  readonly q?: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async get(
    @Query(new ValidationPipe()) _: PaginationRequestDto,
    @Query('q') q: string
  ): Promise<string> {
    const html = await fetch(q).then(r => r.text());
    const root = parse(html);
    const url = new URL(q);
    console.log(url);

    root.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'));

    // root.querySelectorAll('img').forEach(img => {
    //   img.setAttribute('src', url.origin + img.getAttribute('src'));
    // });
    root.querySelector('head').remove();
    root.querySelectorAll('header, footer, script').forEach(el => el.remove());

    return root.toString();
  }
}
