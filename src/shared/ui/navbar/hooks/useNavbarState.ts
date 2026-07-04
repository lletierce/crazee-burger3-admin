import { useCallback, useState } from "react";

type OpenPanel = 'menu' | 'user' | null;

export function useNavbarState() {
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);

  const toggleMenu = useCallback(() => {
    setOpenPanel((current) => (current === 'menu' ? null : 'menu'));
  }, []);

  const toggleUser = useCallback(() => {
    setOpenPanel((current) => (current === 'user' ? null : 'user'));
  }, []);

  const closeAll = useCallback(() => setOpenPanel(null), []);

  return {
    isMenuOpen: openPanel === 'menu',
    isUserOpen: openPanel === 'user',
    toggleMenu,
    toggleUser,
    closeAll,
  };
}