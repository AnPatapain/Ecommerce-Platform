import {Anchor} from "@mantine/core";
import {useNavigate} from "react-router-dom";
import {ReactNode} from "react";

export default function AppLink({underline=true, href, openInNewTab=false, children}: { underline?: boolean; href: string; openInNewTab?: boolean; children: ReactNode }) {
    const navigate = useNavigate();

    return openInNewTab ?
        (<Anchor underline='always' href={href}
                                   target='_blank'>{children}</Anchor>)

        :

        (<Anchor underline={underline ? 'always' : 'never'} href={href} onClick={(event: any) => {
            event.preventDefault();
            navigate(href)
        }}>
            {children}
        </Anchor>)
}