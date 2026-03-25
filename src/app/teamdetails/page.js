"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Change from: export default function TeamDetails({ teamId }) {
export default function TeamDetails(props) {
	const { teamId } = props;
	const router = useRouter();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const [editMembers, setEditMembers] = useState([]);

	useEffect(() => {
		if (!teamId) return setLoading(false);
		async function getData() {
			try {
				const [teamRes, usersRes] = await Promise.all([
					fetch(`/api/teams/${teamId}`),
					fetch(`/api/users`),
				]);
				const teamData = await teamRes.json();
				const usersData = await usersRes.json();

				setData(teamData);
				setEditMembers(teamData.vitStudents || []);
				// Ensure usersData is an array to prevent .map() crash
				setUsers(Array.isArray(usersData) ? usersData : []);
			} catch (err) {
				console.error("Error fetching data:", err);
			} finally {
				setLoading(false);
			}
		}

		getData();
	}, [teamId]);

	const handleSave = async () => {
		try {
			await fetch(`/api/teams/${teamId}`, {
				method: "PUT",
				body: JSON.stringify({
					name: data.name,
					track: data.track,
					members: editMembers,
				}),
			});
			setIsEditing(false);
			// Refresh data
			const res = await fetch(`/api/teams/${teamId}`);
			const ref = await res.json();
			setData(ref);
		} catch (e) {
			console.error(e);
		}
	};

	if (!teamId) {
		return <p>Select a team from Dashboard using View Details.</p>;
	}

	if (loading) return <p>Loading team...</p>;
	if (!data) return <p>No team found</p>;

	return (
		<div className="relative min-h-screen bg-black/50">
			<div className="absolute inset-0 rounded-[1280px] bg-[#669C7D] blur-[375px] opacity-20"></div>
			<h1 className="text-white p-8 text-[20px] font-bold">TEAM DETAILS</h1>
			<div className="flex flex-col items-center pb-8 mt-12">
				<div className="flex flex-col rounded-[10px] w-226 h-auto bg-[rgba(255,255,255,0.10)] backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-4">
					<div className="flex justify-between items-start">
						<div>
							<h2 className="text-white text-[32px] uppercase">{data.name}</h2>
							<h2 className="text-[20px] text-[#9A9A9A] pb-1">
								TRACK : {data.track}
							</h2>
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => router.push(`/team_remarks/${teamId}`)}
								className="px-4 py-2 rounded-full text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]"
							>
								Grade / Remarks
							</button>
							<button
								onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
								className={`px-4 py-2 rounded-full text-sm font-bold ${isEditing ? "bg-green-500 text-white" : "bg-white/10 text-white border border-white/20"}`}
							>
								{isEditing ? "Save Changes" : "Edit Team"}
							</button>
						</div>
					</div>

					<table className="table-auto mt-6 w-full text-left">
						<thead>
							<tr className="border-b border-[#9A9A9A] text-white">
								<th className="pb-4 pl-2">#</th>
								<th className="pb-4">Member Name</th>
								<th className="pb-4">Registration No.</th>
								{isEditing && <th className="pb-4">Actions</th>}
							</tr>
						</thead>
						<tbody>
							{(isEditing ? editMembers : data.vitStudents || []).map(
								(student, index) => (
									<tr
										key={index}
										className="border-b border-white/5 last:border-0"
									>
										<td className="py-2 pl-2 text-white/70">{index + 1}</td>
										<td className="py-2">
											{isEditing ? (
												<input
													className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white w-full"
													value={student.name}
													onChange={(e) => {
														const newM = [...editMembers];
														newM[index].name = e.target.value;
														setEditMembers(newM);
													}}
												/>
											) : (
												<span className="text-white">
													{student.name || "Atiksh"}
												</span>
											)}
										</td>
										<td className="py-2">
											{isEditing ? (
												<input
													className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white w-full"
													value={student.regNo}
													onChange={(e) => {
														const newM = [...editMembers];
														newM[index].regNo = e.target.value;
														setEditMembers(newM);
													}}
												/>
											) : (
												<span className="text-white/80">
													{student.regNo || "atikshkaregno"}
												</span>
											)}
										</td>
										{isEditing && (
											<td className="py-2">
												<button
													onClick={() => {
														setEditMembers(
															editMembers.filter((_, i) => i !== index),
														);
													}}
													className="text-red-400 hover:text-red-300 text-sm"
												>
													Remove
												</button>
											</td>
										)}
									</tr>
								),
							)}
						</tbody>
					</table>

					{isEditing && (
						<button
							onClick={() =>
								setEditMembers([...editMembers, { name: "", regNo: "" }])
							}
							className="mt-4 w-full py-2 border border-dashed border-white/30 text-white/50 hover:text-white hover:border-white rounded-lg transition"
						>
							+ Add Member
						</button>
					)}
				</div>
			</div>{" "}
			<div className="flex justify-center">
				<div className="mx-auto inline-flex flex-row gap-4 bg-[rgba(255,255,255,0.10)] rounded-lg backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-8">
					<div className="items-center flex flex-col gap-2 mt-4">
						<h3 className="text-[16px] font-bold">ROUND 1 SUBMISSION</h3>
						<button className="text-[10.08px] font-medium w-[146.72px] h-[25.2px] rounded-[14px] bg-[rgba(12,172,79,0.50)]">
							ADD/VIEW REMARKS
						</button>
					</div>
					<div className="items-center flex flex-col gap-2 bg-[rgba(255,255,255,0.10)] rounded-lg backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-4 w-full">
						<h3 className="text[12.8px] font-medium self-start">
							Figma Submission
						</h3>
						<div className="flex gap-2 w-full">
							<input
								readOnly
								value={data.figmaLink || "No Link"}
								className="flex-1 bg-black/20 rounded-md px-3 text-sm text-white/80 border border-white/10 outline-none"
							/>
							<a href={data.figmaLink} target="_blank">
								<button className="text-[14.4px] font-medium w-[80px] h-[24.8px] rounded-[20px] bg-[rgba(12,172,79,0.50)] shadow-[0_3.2px_3.2px_0_rgba(0,0,0,0.25)]">
									View
								</button>
							</a>
						</div>
					</div>
					<div className="items-center flex flex-col gap-2 bg-[rgba(255,255,255,0.10)] rounded-lg backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-4 w-full">
						<h3 className="text[12.8px] font-medium self-start">
							GitHub Submission
						</h3>
						<div className="flex gap-2 w-full">
							<input
								readOnly
								value={data.githubLink || "No Link"}
								className="flex-1 bg-black/20 rounded-md px-3 text-sm text-white/80 border border-white/10 outline-none"
							/>
							<a href={data.githubLink} target="_blank">
								<button className="text-[14.4px] font-medium w-[80px] h-[24.8px] rounded-[20px] bg-[rgba(12,172,79,0.50)] shadow-[0_3.2px_3.2px_0_rgba(0,0,0,0.25)]">
									View
								</button>
							</a>
						</div>
					</div>
					<div className="items-center flex flex-col gap-2 bg-[rgba(255,255,255,0.10)] rounded-lg backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-4 w-full">
						<h3 className="text[12.8px] font-medium self-start">
							PPT Submission
						</h3>
						<div className="flex gap-2 w-full">
							<input
								readOnly
								value={data.pptLinks || "No Link"}
								className="flex-1 bg-black/20 rounded-md px-3 text-sm text-white/80 border border-white/10 outline-none"
							/>
							<a href={data.pptLinks} target="_blank">
								<button className="text-[14.4px] font-medium w-[80px] h-[24.8px] rounded-[20px] bg-[rgba(12,172,79,0.50)] shadow-[0_3.2px_3.2px_0_rgba(0,0,0,0.25)]">
									View
								</button>
							</a>
						</div>
					</div>
					<div className="items-center flex flex-col gap-2 bg-[rgba(255,255,255,0.10)] rounded-lg backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-4 w-full">
						<h3 className="text[12.8px] font-medium self-start">
							Other Submission
						</h3>
						<div className="flex gap-2 w-full">
							<input
								readOnly
								value={data.otherLinks || "No Link"}
								className="flex-1 bg-black/20 rounded-md px-3 text-sm text-white/80 border border-white/10 outline-none"
							/>
							<a href={data.otherLinks} target="_blank">
								<button className="text-[14.4px] font-medium w-[80px] h-[24.8px] rounded-[20px] bg-[rgba(12,172,79,0.50)] shadow-[0_3.2px_3.2px_0_rgba(0,0,0,0.25)]">
									View
								</button>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
