import { Heading } from "@/components/ui/heading";
import { MessageSquare } from "lucide-react";

const ConversationPage = () => {
    return (
        <div>
            <Heading 
            title="Conversation"
            description="Our most advanced Conversation model"
            icon={MessageSquare}
            iconColor="text-violet-500"
            bgColor="bg-violet-500/10"
            />
        </div>
    );
}

export default ConversationPage;