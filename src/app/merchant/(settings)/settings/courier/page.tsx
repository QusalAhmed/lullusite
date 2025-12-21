import React from "react";
import getCourierSettings from "@/actions/settings/get-courier-settings";
import { CourierSettingsForm } from "./courier-settings-form";

const CourierPage = async () => {
    const result = await getCourierSettings();

    const existingCouriers = result.success ? result.data ?? [] : [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Courier Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Manage API credentials and enable or disable individual courier providers.
                </p>
            </div>

            <CourierSettingsForm existingCouriers={existingCouriers} />
        </div>
    );
};

export default CourierPage;