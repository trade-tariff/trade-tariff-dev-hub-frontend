export class DashboardPresenter {
    private static statusButton(text: string): string {
        return `<button class="govuk-button govuk-button--secondary" type="button">${text}</button>`;
    }

    private static createDeleteForm(fpoId: string, CustomerKeyId: string): string {
        return `
            <form action="/keys/${fpoId}/${CustomerKeyId}/delete" method="post">
                <button type="submit" class="govuk-button govuk-button--warning">Revoke</button>
            </form>
        `;
    }

    public static present(apiKeys: any[], fpoId: string): any {
        const rows = apiKeys.map(key => {
            const status = key["Enabled"] ? 'Active' : 'Inactive';
            const deleteButton = DashboardPresenter.createDeleteForm(fpoId, key.CustomerApiKeyId);
            const updateButton: string = DashboardPresenter.statusButton(status);

            return [
                { text: key.CustomerApiKeyId },
                { text: key.Description },
                { text: key.UpdatedAt },
                { html: updateButton },
                { html: deleteButton }
            ];
        });
        return {
            rows: rows,
        };
    }
}
