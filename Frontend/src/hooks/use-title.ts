import Titles from "@/constants/Titles";
import { useDocumentTitle } from "@mantine/hooks";
import { usePathname } from "next/navigation";

function useTitle(explicitTitle?: string) {
    const path = usePathname();
    useDocumentTitle(
        explicitTitle
            ? explicitTitle + " – Electro"
            : Titles[path as keyof typeof Titles] || "Electro",
    );
}

export default useTitle;
