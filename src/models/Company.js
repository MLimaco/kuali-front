export class Company {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.ruc = data.ruc;
        this.size = data.size ?? '';
        this.website = data.website ?? '';
        this.sector = data.sector ?? '';
        this.createAt = data.createAt ? new Date(data.createAt) : null;
        this.updateAt = data.updateAt ? new Date(data.updateAt) : null;
        this.deleteAt = data.deleteAt ? new Date(data.deleteAt) : null;
        // Relacionales (opcional)
        this.leads = data.leads ?? [];
        this.contactLogs = data.contactLogs ?? [];
    }

    toJSON() {
        return {
            name: this.name,
            ruc: this.ruc,
            size: this.size,
            website: this.website,
            sector: this.sector
        };
    }
}