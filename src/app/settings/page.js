"use client";
import { useEffect, useState } from "react";

export default function Settings() {
	const [form, setForm] = useState({ name: "", email: "", regno: "" });
	const [downloading, setDownloading] = useState(false);
	const [admins, setAdmins] = useState([]);
	const [loadingAdmins, setLoadingAdmins] = useState(true);
	const [removingAdminId, setRemovingAdminId] = useState(null);

	const fetchAdmins = async () => {
		try {
			setLoadingAdmins(true);
			const res = await fetch("/api/settings");
			const data = await res.json();
			setAdmins(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error(err);
			setAdmins([]);
		} finally {
			setLoadingAdmins(false);
		}
	};

	useEffect(() => {
		fetchAdmins();
	}, []);

	const handleChange = (e) => {
		if (!e.target.name) return;
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = JSON.stringify(form);
		const res = await fetch("/api/settings", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: data,
		});
		if (res.ok) {
			console.log("Admin added successfully");
			console.log(data);
			setForm({ name: "", email: "", regno: "" }); // Reset form
			await fetchAdmins();
			alert("Admin added successfully");
		} else {
			const err = await res.json().catch(() => ({}));
			console.log("Failed to add admin");
			alert(err.error || "Failed to add admin");
		}
	};

	const handleRemoveAdmin = async (adminId) => {
		if (!confirm("Remove this admin access?")) return;

		try {
			setRemovingAdminId(adminId);
			const res = await fetch(`/api/settings/${adminId}`, {
				method: "DELETE",
			});

			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.error || "Failed to remove admin");
			}

			await fetchAdmins();
		} catch (err) {
			console.error(err);
			alert(err.message || "Failed to remove admin");
		} finally {
			setRemovingAdminId(null);
		}
	};

	const handleBackup = async () => {
		setDownloading(true);
		try {
			const res = await fetch("/api/backup");
			if (!res.ok) throw new Error("Backup failed");

			const data = await res.json();
			const blob = new Blob([JSON.stringify(data, null, 2)], {
				type: "application/json",
			});
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;

			// Timestamp naming: backup-YYYY-MM-DD_HH-MM-SS.json
			const date = new Date();
			const timestamp = date.toISOString().replace(/[:.]/g, "-");
			a.download = `backup-${timestamp}.json`;

			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (err) {
			console.error(err);
			alert("Failed to download backup");
		} finally {
			setDownloading(false);
		}
	};

	return (
		<div className="relative min-h-screen bg-black/50 overflow-hidden">
			<div className="absolute inset-0 rounded-[1280px] bg-[#669C7D] blur-[375px] opacity-20 pointer-events-none"></div>

			<div className="relative z-10">
				<h1 className="text-white p-8 text-[20px] font-bold">SETTINGS</h1>

				<div className="flex justify-center flex-col items-center gap-8">
					{/* Backup Section */}
					<div className="w-150.5 flex justify-end">
						<button
							onClick={handleBackup}
							disabled={downloading}
							className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-full shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{downloading ? "Downloading..." : "⬇ Download Data Backup"}
						</button>
					</div>

					<form
						onSubmit={handleSubmit}
						className="w-150.5 h-auto flex flex-col justify-center rounded-[25px] bg-[rgba(255,255,255,0.10)] backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-8 gap-6"
					>
						<h1 className="text-[24px] pt-6">ADD NEW ADMIN</h1>
						<label className="text-[20px] pl-3">Name</label>
						<input
							name="name"
							className="rounded-[15px] bg-[#D9D9D9]/30 w-129 h-12 text-[15px] self-center p-4"
							type="text"
							placeholder="Enter Name"
							onChange={handleChange}
							value={form.name}
						></input>
						<label className="text-[20px] pl-3">Email Address</label>
						<input
							name="email"
							className="rounded-[15px] bg-[#D9D9D9]/30 w-129 h-12 text-[15px] self-center p-4"
							type="email"
							placeholder="Enter Email Address"
							onChange={handleChange}
							value={form.email}
						></input>
						<label className="text-[20px] pl-3">Registration Number</label>
						<input
							name="regno"
							className="rounded-[15px] bg-[#D9D9D9]/30 w-129 h-12 text-[15px] self-center p-4"
							type="text"
							placeholder="Enter Name"
							onChange={handleChange}
							value={form.regno}
						></input>
						<button
							className="bg-[#0CAC4F]/50 rounded-[25px] w-48 h-11.25 self-center mt-4"
							type="submit"
						>
							ADD ADMIN
						</button>
					</form>

					<div className="w-150.5 h-auto flex flex-col justify-center rounded-[25px] bg-[rgba(255,255,255,0.10)] backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-8 gap-4">
						<h1 className="text-[24px] pt-2">PERMITTED ADMINS</h1>

						{loadingAdmins ? (
							<p className="text-white/70">Loading admins...</p>
						) : admins.length === 0 ? (
							<p className="text-white/70">No admins configured.</p>
						) : (
							<div className="space-y-3">
								{admins.map((admin) => (
									<div
										key={admin.id}
										className="rounded-[15px] bg-[#D9D9D9]/20 px-4 py-3 flex items-center justify-between"
									>
										<div className="text-white">
											<p className="font-semibold">{admin.name}</p>
											<p className="text-sm text-white/80">{admin.email}</p>
											<p className="text-xs text-white/60">
												Reg No: {admin.registrationNumber}
											</p>
										</div>

										<button
											onClick={() => handleRemoveAdmin(admin.id)}
											disabled={removingAdminId === admin.id}
											className="bg-red-500/70 hover:bg-red-500 text-white rounded-[20px] px-4 py-2 text-sm disabled:opacity-50"
										>
											{removingAdminId === admin.id ? "Removing..." : "Remove"}
										</button>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
