import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get()
  getRoot(@Req() req: Request) {
    const htmlTemplate = `
      <html>
        <head>
          <title>Verdeo Auth Service API</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              margin-top: 50px;
            }
            h1 {
              color: #4CAF50;
            }
            p {
              font-size: 18px;
            }
            a {
              color: #2196F3;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <h1>Verdeo Auth Service API está funcionando!</h1>
          <p>Bem-vindo à Verdeo Auth Service API. Você pode acessar a <a href="/swagger">Documentação Swagger</a> para mais informações.</p>
        </body>
      </html>
    `;
    return htmlTemplate;
  }

  @Get('health')
  getHealth(@Req() req: Request) {
    return {
      status: 'ok',
      message: 'Verdeo Auth Service API está funcionando',
      swagger: `${req.protocol}://${req.get('host')}/swagger`,
      timestamp: new Date().toISOString(),
    };
  }
}
