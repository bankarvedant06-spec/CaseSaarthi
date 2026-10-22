export const officer = {
  name: 'Aditi Sharma',
  role: 'Monitoring Officer',
  bureau: 'Central Coordination Cell',
  lastLogin: '20 Oct 2026',
}

export const bureaus = [
  'Approval Bureau',
  'University Bureau',
  'Scholarship Bureau',
  'Grievance Cell',
  'Quality Assurance Cell',
  'Anti-Ragging Cell',
]

export const categories = [
  'Affiliation Delay',
  'Faculty Recruitment',
  'Infrastructure',
  'Scholarship Disbursement',
  'Fee Regulation',
  'Anti-Ragging',
  'Quality of Education',
  'Approval Process',
]

export const institutions = [
  {
    id: '1-24567109',
    name: 'Indian Institute of Technology Delhi',
    type: 'Institute of National Importance',
    state: 'Delhi',
    complaints: 7,
  },
  {
    id: '1-38912044',
    name: 'National Institute of Technology Tiruchirappalli',
    type: 'Institute of National Importance',
    state: 'Tamil Nadu',
    complaints: 5,
  },
  {
    id: '1-51288371',
    name: 'College of Engineering Pune',
    type: 'Government Engineering College',
    state: 'Maharashtra',
    complaints: 4,
  },
  {
    id: '1-66720418',
    name: 'Jadavpur University',
    type: 'State University',
    state: 'West Bengal',
    complaints: 3,
  },
  {
    id: '1-77491025',
    name: 'Vellore Institute of Technology',
    type: 'Deemed University',
    state: 'Tamil Nadu',
    complaints: 6,
  },
  {
    id: '1-80133462',
    name: 'Birla Institute of Technology and Science, Pilani',
    type: 'Deemed University',
    state: 'Rajasthan',
    complaints: 2,
  },
  {
    id: '1-91824503',
    name: 'Delhi Technological University',
    type: 'State University',
    state: 'Delhi',
    complaints: 4,
  },
  {
    id: '1-10239876',
    name: 'Anna University',
    type: 'State University',
    state: 'Tamil Nadu',
    complaints: 8,
  },
]

export const initialComplaints = [
  {
    id: 'CS-2026-1042',
    institutionId: '1-24567109',
    institution: 'Indian Institute of Technology Delhi',
    category: 'Faculty Recruitment',
    bureau: 'University Bureau',
    officer: 'Kavita Rao',
    received: '2026-10-12',
    expected: '2026-11-20',
    status: 'Under Process',
    description:
      'Allegation that advertised faculty posts were processed without the stipulated screening timeline, affecting candidates from affiliated programmes.',
  },
  {
    id: 'CS-2026-1098',
    institutionId: '1-24567109',
    institution: 'Indian Institute of Technology Delhi',
    category: 'Approval Process',
    bureau: 'Approval Bureau',
    officer: 'Arjun Mehta',
    received: '2026-10-08',
    expected: '2026-11-05',
    status: 'Pending',
    description:
      'Delay in processing programme approval linked to faculty strength documentation for the same department cited in recruitment grievance.',
  },
  {
    id: 'CS-2026-1114',
    institutionId: '1-38912044',
    institution: 'National Institute of Technology Tiruchirappalli',
    category: 'Infrastructure',
    bureau: 'Approval Bureau',
    officer: 'Priya Nair',
    received: '2026-10-04',
    expected: '2026-11-18',
    status: 'Under Process',
    description:
      'Complaint regarding inadequate laboratory capacity for an approved intake increase.',
  },
  {
    id: 'CS-2026-1120',
    institutionId: '1-38912044',
    institution: 'National Institute of Technology Tiruchirappalli',
    category: 'Affiliation Delay',
    bureau: 'University Bureau',
    officer: 'S. Iyer',
    received: '2026-09-29',
    expected: '2026-11-10',
    status: 'Pending',
    description:
      'Affiliation correspondence cites the same laboratory shortfall while seeking continuation of intake.',
  },
  {
    id: 'CS-2026-1135',
    institutionId: '1-77491025',
    institution: 'Vellore Institute of Technology',
    category: 'Fee Regulation',
    bureau: 'Grievance Cell',
    officer: 'Rohan Desai',
    received: '2026-09-22',
    expected: '2026-10-30',
    status: 'Disposed',
    description:
      'Fee-component dispute for a professional programme. Matter recorded as disposed after institution clarification.',
  },
  {
    id: 'CS-2026-1148',
    institutionId: '1-10239876',
    institution: 'Anna University',
    category: 'Scholarship Disbursement',
    bureau: 'Scholarship Bureau',
    officer: 'Meera Joshi',
    received: '2026-09-18',
    expected: '2026-10-28',
    status: 'Under Process',
    description:
      'Delayed disbursement reported for eligible students in an affiliated college cluster.',
  },
  {
    id: 'CS-2026-1161',
    institutionId: '1-10239876',
    institution: 'Anna University',
    category: 'Quality of Education',
    bureau: 'Quality Assurance Cell',
    officer: 'Kavita Rao',
    received: '2026-09-12',
    expected: '2026-11-02',
    status: 'Pending',
    description:
      'Quality audit observations on faculty-student ratio in the same affiliated cluster named in the scholarship matter.',
  },
  {
    id: 'CS-2026-1174',
    institutionId: '1-51288371',
    institution: 'College of Engineering Pune',
    category: 'Anti-Ragging',
    bureau: 'Anti-Ragging Cell',
    officer: 'Priya Nair',
    received: '2026-09-07',
    expected: '2026-10-15',
    status: 'Disposed',
    description:
      'Campus incident reported and closed after institutional inquiry documentation was received.',
  },
  {
    id: 'CS-2026-1189',
    institutionId: '1-91824503',
    institution: 'Delhi Technological University',
    category: 'Infrastructure',
    bureau: 'Approval Bureau',
    officer: 'Arjun Mehta',
    received: '2026-08-26',
    expected: '2026-10-20',
    status: 'Under Process',
    description:
      'Hostels and studio space cited as insufficient against the last approved intake.',
  },
  {
    id: 'CS-2026-1203',
    institutionId: '1-66720418',
    institution: 'Jadavpur University',
    category: 'Faculty Recruitment',
    bureau: 'University Bureau',
    officer: 'S. Iyer',
    received: '2026-08-19',
    expected: '2026-10-12',
    status: 'Pending',
    description:
      'Representation on contractual faculty appointments exceeding advertised duration.',
  },
  {
    id: 'CS-2026-1215',
    institutionId: '1-80133462',
    institution: 'Birla Institute of Technology and Science, Pilani',
    category: 'Approval Process',
    bureau: 'Approval Bureau',
    officer: 'Meera Joshi',
    received: '2026-08-11',
    expected: '2026-09-30',
    status: 'Disposed',
    description:
      'Clarification on additional campus programme approval. File marked disposed.',
  },
  {
    id: 'CS-2026-1228',
    institutionId: '1-77491025',
    institution: 'Vellore Institute of Technology',
    category: 'Scholarship Disbursement',
    bureau: 'Scholarship Bureau',
    officer: 'Rohan Desai',
    received: '2026-10-16',
    expected: '2026-11-25',
    status: 'Pending',
    description:
      'Fresh representation on delayed scholarship credit for the same student cohort previously reviewed.',
  },
]

export const overlapAlerts = [
  {
    id: 'CR-01',
    cases: ['CS-2026-1042', 'CS-2026-1098'],
    institution: 'Indian Institute of Technology Delhi',
    institutionId: '1-24567109',
    categories: ['Faculty Recruitment', 'Approval Process'],
    bureaus: ['University Bureau', 'Approval Bureau'],
    reason:
      'Same institution and department context. Recruitment timeline concerns and programme-approval faculty-strength documentation describe the same underlying capacity issue. Flagged for human review, not treated as a duplicate.',
  },
  {
    id: 'CR-02',
    cases: ['CS-2026-1114', 'CS-2026-1120'],
    institution: 'National Institute of Technology Tiruchirappalli',
    institutionId: '1-38912044',
    categories: ['Infrastructure', 'Affiliation Delay'],
    bureaus: ['Approval Bureau', 'University Bureau'],
    reason:
      'Both records cite laboratory shortfall against intake. One sits with Approval Bureau and the other with University Bureau, suggesting a coordination requirement.',
  },
  {
    id: 'CR-03',
    cases: ['CS-2026-1148', 'CS-2026-1161'],
    institution: 'Anna University',
    institutionId: '1-10239876',
    categories: ['Scholarship Disbursement', 'Quality of Education'],
    bureaus: ['Scholarship Bureau', 'Quality Assurance Cell'],
    reason:
      'Overlapping affiliated-college cluster and overlapping review window. Workload and quality observations may need a joint note, subject to officer confirmation.',
  },
  {
    id: 'CR-04',
    cases: ['CS-2026-1135', 'CS-2026-1228'],
    institution: 'Vellore Institute of Technology',
    institutionId: '1-77491025',
    categories: ['Fee Regulation', 'Scholarship Disbursement'],
    bureaus: ['Grievance Cell', 'Scholarship Bureau'],
    reason:
      'Related student-finance theme at the same institution. One file is disposed; the newer scholarship record may still be independent. Review recommended.',
  },
]

export const monthlyVolume = [
  { label: 'Nov', received: 14, disposed: 9 },
  { label: 'Dec', received: 19, disposed: 11 },
  { label: 'Jan', received: 22, disposed: 16 },
  { label: 'Feb', received: 17, disposed: 18 },
  { label: 'Mar', received: 28, disposed: 20 },
  { label: 'Apr', received: 24, disposed: 22 },
  { label: 'May', received: 31, disposed: 19 },
  { label: 'Jun', received: 27, disposed: 25 },
  { label: 'Jul', received: 33, disposed: 28 },
  { label: 'Aug', received: 29, disposed: 30 },
  { label: 'Sep', received: 36, disposed: 27 },
  { label: 'Oct', received: 21, disposed: 18 },
]

export const approvalSpark = [42, 48, 45, 52, 49, 58, 61, 55, 67, 70, 68, 72]
export const disposalSpark = [38, 40, 44, 41, 47, 52, 49, 58, 60, 63, 70, 81]

export const notifications = [
  {
    id: 'n1',
    title: 'Coordination alert CR-01',
    body: 'IIT Delhi cases may need University and Approval Bureau review.',
    time: '2h ago',
  },
  {
    id: 'n2',
    title: 'Expected disposal approaching',
    body: 'CS-2026-1135 was due 30 Oct. File already disposed.',
    time: '6h ago',
  },
  {
    id: 'n3',
    title: 'New complaint registered',
    body: 'CS-2026-1228 added for VIT under Scholarship Bureau.',
    time: '1d ago',
  },
]
