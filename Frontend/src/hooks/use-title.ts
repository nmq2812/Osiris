import Titles from "@/constants/Titles";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

function useTitle(explicitTitle?: string) {
    const path = usePathname();

    useEffect(() => {
        const title = explicitTitle
            ? explicitTitle + " – Electro"
            : Titles[path as keyof typeof Titles] || "Electro";

        document.title = title;
    }, [path, explicitTitle]);
}

export default useTitle;
