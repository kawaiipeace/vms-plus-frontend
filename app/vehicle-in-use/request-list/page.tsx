import MobileFileBackCard from "@/app/components/card/mobileFileBackCard";
import MobileWaitForKeyCard from "@/app/components/card/mobileWaitForKeyCard";
import MobileWaitingCard from "@/app/components/card/mobileWaitingCard";

export default function RequestList(){
    return(
        <>
        <MobileFileBackCard />
        <MobileWaitForKeyCard />
        <MobileWaitingCard />
        </>
    );
}