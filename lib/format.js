export const rupiah = (n) => "Rp " + new Intl.NumberFormat("id-ID").format(Math.round(Number(n) || 0));
export const tgl = (d) => (d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-");
