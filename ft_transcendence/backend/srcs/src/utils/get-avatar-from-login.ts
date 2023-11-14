import { StreamableFile } from "@nestjs/common";
import { getUserFromLogin } from "./get-user-from-id";
import { createReadStream } from 'fs';
import { join } from 'path';

async function getAvatarFromLogin(login:string, avatar?: string){
        if (!avatar) avatar = (await getUserFromLogin(login)).avatar;
        if (avatar !== null) {
          const file = createReadStream(join(__dirname, `../../public/avatars/${login}.jpg`));
          return new StreamableFile(file);
        } else {
          const file = createReadStream(join(__dirname, `../../public/avatars/avatar.png`));
          return new StreamableFile(file);
        }
}

export { getAvatarFromLogin };