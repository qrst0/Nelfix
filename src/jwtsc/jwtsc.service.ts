import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';

@Injectable()
export class JwtscService {
    private readonly alg = {"alg": "HS256", "typ": "JWT"};
    private key = this.configService.get('JWT_SECRET');
    private expiresIn = this.configService.get('EXPIRES_IN');
    constructor(private readonly configService: ConfigService){}
    async encodeBase64(str: any) {
        return Buffer.from(str, 'utf8').toString('base64');
    }

    async decodeBase64(str: any) {
        return Buffer.from(str, 'base64').toString("utf-8");
    }
    
    async stringify(obj: any) {
        return JSON.stringify(obj);
    }

    async checkSumGen(head: any, body: any) {
        var checkSumStr = head + "." + body; 
        var hash = createHmac('sha256', this.key);
        var checkSum = hash.update(checkSumStr).digest('base64').toString();
        var utf8 = Buffer.from(checkSum, 'base64').toString('utf-8');
        return checkSum;
    }

    async encode(obj: any) {
        obj['exp'] = Date.now() + parseInt(this.expiresIn);
        var result = "";
        var header = await this.encodeBase64(await this.stringify(this.alg));
        result += header + ".";
        var body = await this.encodeBase64(await this.stringify(obj));
        result += body + ".";

        var checkSum = await this.checkSumGen(header,body);
        result += checkSum; 
        return result;
    }

    async decode(str: string){
        var jwtArr = str.split("."); 
        var head = jwtArr[0];
        var body = jwtArr[1];
        var hash = jwtArr[2];
        var checkSum = await this.checkSumGen(head,body); 

        if(hash === checkSum) {
            const decodedBody = await this.decodeBase64(body);
            if(decodedBody['exp'] > Date.now()){
                return false;
            }
            return JSON.parse(decodedBody);
        } else {
            throw new UnauthorizedException();
        }
    }

}
