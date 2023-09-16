import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from 'passport-oauth2';
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
	private readonly _profileURL = 'https://api.intra.42.fr/v2/me';

	constructor( config: ConfigService) {
		super({
			authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
			tokenURL: 'https://api.intra.42.fr/oauth/token',
			clientID: config.get("42_CLIENT_ID"),
            clientSecret: config.get("42_CLIENT_SECRET"),
            callbackURL: config.get("42_CALLBACK_URL"),
			scope: 'public',
		});
	}

	async validate( accessToken: string){
		return new Promise<User>((resolve, reject) => {
			this._oauth2.get(this._profileURL, accessToken, (err, body) => {
                const { id, login, displayname, last_name, first_name, email, image } =  JSON.parse(body as any);
				const user: any = {
					id: id as number,
					login: login as string,
					firstName: first_name as string,
					lastName: last_name as string,
					email: email as string,
					avatar: image.link,
				}
                resolve(user);
			});
		});
	}
}
