import Titles from "@/constants/Titles";
import { useDocumentTitle } from "@mantine/hooks";
import { usePathname } from "next/navigation";

function useTitle(explicitTitle?: string) {
    const path = usePathname();
    useDocumentTitle(
        explicitTitle
            ? explicitTitle + " – Electro"
            : Titles[path] || "Electro",
    );
}

export default useTitle;
