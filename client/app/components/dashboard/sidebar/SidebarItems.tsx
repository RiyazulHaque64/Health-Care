import { IDrawerItem } from "@/app/types";
import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarItems = ({ item }: { item: IDrawerItem }) => {
  const linkPath = `/dashboard/${item.path}`;
  const pathName = usePathname();
  return (
    <Link href={linkPath}>
      <ListItem
        disablePadding
        sx={{
          ...(linkPath === pathName
            ? {
                borderRight: "3px solid #1586FD",
                "& svg": { color: "#1586FD" },
              }
            : {}),
          mb: 1,
        }}
      >
        <ListItemButton>
          <ListItemIcon>{item.icon && <item.icon />}</ListItemIcon>
          <ListItemText primary={item.title} />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

export default SidebarItems;
