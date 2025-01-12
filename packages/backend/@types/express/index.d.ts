import {User} from "@app/shared-models/src/user.model";
import {BufferedFile} from "@app/shared-models/src/api.type";
import {SecurityScope} from "../../src/security/scopes";

declare global {
    namespace Express {
        interface Request {
            securityContext?: {
                user: User,
                scopes: Set<SecurityScope>,
            }
        }
    }
}