"use client"
import React, { useState,useEffect } from "react";
import {
  Bell,
  Building2,
  KeyRound,
  Mail,
  Moon,
  Package,
  Shield,
} from "lucide-react";
import { SettingsPageHeader } from "./SettingsPageHeader";
import { SettingsSection } from "./SettingsSection";
import { SettingsProvider } from "./client/SettingsProvider";
import { SettingsToastStack } from "./client/SettingsToastStack";
import { SettingsAnimatedGrid } from "./client/SettingsAnimatedGrid";
import { DarkModeToggle } from "./client/DarkModeToggle";
import { UpdateEmailForm } from "./client/UpdateEmailForm";
import { ChangePasswordForm } from "./client/ChangePasswordForm";
import { NotificationPreferences } from "./client/NotificationPreferences";
import { InventoryPreferences } from "./client/InventoryPreferences";
import { SecuritySettings } from "./client/SecuritySettings";
import { RestaurantProfileSettings } from "./client/RestaurantProfileSettings";


export function SettingsPageContent() {
const [userinfo, setuserinfo] = useState("")


  
  useEffect(() => {
    const userDataString = localStorage.getItem("velvetUser"); 
    
    if (userDataString) {
      try {
        const user = JSON.parse(userDataString);
        
        if (user && user.role) {
          setuserinfo(user.role as string);
        }
      } catch (error) {
        console.error("JSON parse karne mein masla hua:", error);
      }
    } else {
      console.error("User local storage mein nahi mila");
    }
  }, []);
  return (
    <SettingsProvider>
      <SettingsToastStack />
      <div className="w-full transition-colors duration-300 dark:text-zinc-100">
        <SettingsPageHeader />

        <SettingsAnimatedGrid>
          <SettingsSection
            title="Appearance"
            description="Customize how your inventory dashboard looks."
            icon={<Moon size={18} />}
          >
            <DarkModeToggle />
          </SettingsSection>

         {userinfo === "Branch Managar" && (<SettingsSection
            title="Restaurant Profile"
            description="Business details for reports and vendor communication."
            icon={<Building2 size={18} />}
          >
            <RestaurantProfileSettings />
          </SettingsSection>)
        }
          <SettingsSection
            title="Account Email"
            description="Update the email linked to your inventory manager account."
            icon={<Mail size={18} />}
          >
            <UpdateEmailForm />
          </SettingsSection>

          <SettingsSection
            title="Change Password"
            description="Keep your account secure with a strong password."
            icon={<KeyRound size={18} />}
          >
            <ChangePasswordForm />
          </SettingsSection>

          <SettingsSection
            title="Notifications"
            description="Control how and when you receive inventory alerts."
            icon={<Bell size={18} />}
          >
            <NotificationPreferences />
          </SettingsSection>

          <SettingsSection
            title="Inventory Preferences"
            description="Stock thresholds, units, and export defaults."
            icon={<Package size={18} />}
          >
            <InventoryPreferences />
          </SettingsSection>
        </SettingsAnimatedGrid>

        <div className="mt-5">
          <SettingsSection
            title="Security"
            description="Session timeout and two-factor authentication."
            icon={<Shield size={18} />}
          >
            <SecuritySettings />
          </SettingsSection>
        </div>
      </div>
    </SettingsProvider>
  );
}
