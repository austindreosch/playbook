'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useMediaQuery from '@/hooks/useMediaQuery';
import { cn } from "@/lib/utils";
import { BookCopy } from 'lucide-react';
import { useState } from "react";
import RankingsSidePanel from "./RankingsSidePanel";

const MyRankingsButton = ({ onRankingSelect, text, useIconOnlyStyles = false, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleSelectAndClose = (rankingId) => {
    if (onRankingSelect) {
      onRankingSelect(rankingId);
    }
    setIsOpen(false);
  };

  const triggerButton = (
    <Button
      variant="default"
      className={cn(
        "flex items-center gap-1.5",
        useIconOnlyStyles ? "p-2.5" : "px-3 py-1.5 text-sm font-medium",
        "bg-pb_blue hover:bg-pb_bluehover text-white",
        className
      )}
      aria-label={text || "Select ranking"}
      title={text || (useIconOnlyStyles ? "Rankings" : undefined)}
    >
      <BookCopy className={cn(useIconOnlyStyles ? "h-5 w-5" : "h-4 w-4")} />
      {text && <span className="text-xs md:text-sm lg:hidden">{text}</span>}
    </Button>
  );

  const panelContentWrapperClasses = cn(
    "p-4 overflow-y-auto",
    isMobile ? "max-h-[70vh]" : "max-h-96" // 70vh for mobile drawer, max-h-96 (24rem) for desktop dialog
  );

  const panelContent = (
    <div className={panelContentWrapperClasses}>
      <RankingsSidePanel onSelectRanking={handleSelectAndClose} />
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>My Rankings</DrawerTitle>
            <DrawerDescription>
              Select a ranking list to view or edit.
            </DrawerDescription>
          </DrawerHeader>
          {panelContent}
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>My Rankings</DialogTitle>
        </DialogHeader>
        {panelContent}
      </DialogContent>
    </Dialog>
  );
};

export default MyRankingsButton; 