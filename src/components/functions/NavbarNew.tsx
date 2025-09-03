"use client";
import React, { useState } from "react";
import { useAuth } from '@/app/_contexts/Authcontext';
import { AdminOnly } from '@/components/functions/AdminGuard';
import { Menu, MenuItem, HoveredLink } from "@/components/ui/navbar-menu";

export default function Navbar() {
  const [active, setActive] = useState<string | null>(null);
  const { user } = useAuth();

  return (
    <div className="fixed top-10 inset-x-0 max-w-4xl mx-auto z-50">
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Home">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/">Home Page</HoveredLink>
            <HoveredLink href="/about">About Us</HoveredLink>
          </div>
        </MenuItem>
        
        <MenuItem setActive={setActive} active={active} item="Posts">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/viewpost">View All Posts</HoveredLink>
            <HoveredLink href="/categories">Categories</HoveredLink>
          </div>
        </MenuItem>
        
        {user && (
          <>
            <AdminOnly>
              <MenuItem setActive={setActive} active={active} item="Create">
                <div className="flex flex-col space-y-4 text-sm">
                  <HoveredLink href="/createblog">Write New Post</HoveredLink>
                  <HoveredLink href="/drafts">Drafts</HoveredLink>
                </div>
              </MenuItem>
            </AdminOnly>
            
            <AdminOnly>
              <MenuItem setActive={setActive} active={active} item="Admin">
                <div className="flex flex-col space-y-4 text-sm">
                  <HoveredLink href="/admin">Admin Dashboard</HoveredLink>
                  <HoveredLink href="/admin/users">Manage Users</HoveredLink>
                  <HoveredLink href="/admin/posts">Manage Posts</HoveredLink>
                </div>
              </MenuItem>
            </AdminOnly>
          </>
        )}
      </Menu>
    </div>
  );
}
