import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { overlayShow } from "../../animations/DialogShow";
import { styled } from "../../stitches.config";
import Flex from "./Flex";
import Box from "./Box";
import Button from "./Button";

const StyledOverlay = styled(AlertDialogPrimitive.Overlay, {
  backdropFilter: "blur(3px)",
  backgroundColor: "rgba(80, 80, 89, 0.2)",
  position: "fixed",
  inset: 0,
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  zIndex: "100",
});

const StyledContent = styled(AlertDialogPrimitive.Content, Flex, Box, {
  flexDirection: "column !important",
  backgroundColor: "white !important",
  borderRadius: "$12 !important",
  position: "fixed",
  top: "19.5%",
  left: "41.53%",
  maxWidth: "500px",
  width: "90vw",
  zIndex: "100",
  boxShadow: "0px 4px 16px -4px rgba(18, 25, 34, 0.2)",
  "&:focus": { outline: "none" },
});

export const AlertDialogTrigger = styled(AlertDialogPrimitive.Trigger, {});
export const AlertDialogCancel = styled(AlertDialogPrimitive.Cancel, Button, {});
export const AlertDialogAction = styled(AlertDialogPrimitive.Action, Button, {});

const Content: React.FC = ({ children, ...props }) => {
  return (
    <AlertDialogPrimitive.Portal>
      <StyledOverlay />
      <StyledContent {...props}>{children}</StyledContent>
    </AlertDialogPrimitive.Portal>
  );
};

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogContent = Content;
export const AlertDialogTitle = AlertDialogPrimitive.Title;
