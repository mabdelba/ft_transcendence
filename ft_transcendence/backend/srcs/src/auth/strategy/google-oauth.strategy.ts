import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(config: ConfigService) {
        super({
            clientID: config.get("GOOGLE_CLIENT_ID"),
            clientSecret: config.get("GOOGLE_CLIENT_SECRET"),
            callbackURL: config.get("GOOGLE_CALLBACK_URL"),
            scope: ['profile', 'email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name , emails, photos } = profile;
        const user = {
            email: emails[0].value as string,
            firstName: name.givenName as string,
            lastName: name.familyName as string,
            picture: photos[0].value as string,
            accessToken,
            refreshToken,
        };
        done(null, user);
    }
}