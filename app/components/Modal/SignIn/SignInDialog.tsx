import useIsMobile from "../../../hooks/useIsMobile";
import BottomSheet from "../../BottomSheet/BottomSheet";
import Modal from "../Modal";
import SignInContent from "./SignInContent";

export default function SignIn({
  isOpen,
  onClose,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}) {
  const isMobile = useIsMobile();

  const content = (
    <SignInContent title={title} message={message} onClose={onClose} />
  );

  return isMobile ? (
    <BottomSheet isOpen={isOpen} onClose={onClose} size="md">
      {content}
    </BottomSheet>
  ) : (
    <Modal isOpen={isOpen} onClose={onClose} width="max-w-sm">
      {content}
    </Modal>
  );
}
