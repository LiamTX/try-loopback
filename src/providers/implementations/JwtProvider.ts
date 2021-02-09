import {HttpErrors} from '@loopback/rest';
import jwt from 'jsonwebtoken';
import {ITokenProvider} from '../ITokenProvider';


export class JwtProvider implements ITokenProvider {
  async generate(data: unknown): Promise<string> {
    if (!data) {
      throw new HttpErrors.Unauthorized('Error while generating token: data is null');
    }

    try {
      return jwt.sign({data}, 'S3cr3t', {
        expiresIn: '7h'
      })
    } catch (error) {
      throw new HttpErrors.Unauthorized(`error generating token ${error}`);
    }
  }

}
