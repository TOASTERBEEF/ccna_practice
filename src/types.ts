
export interface Domain {
  id: string;
  title: string;
  percentage: number;
  description: string;
  topics: string[];
  color: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  domainId: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: Difficulty;
}

export interface LabChallenge {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: 'topology' | 'cli' | 'mixed';
  description: string;
  tasks: string[];
  tips?: string;
}

export const CCNA_DOMAINS: Domain[] = [
  {
    id: "domain1",
    title: "Network Fundamentals",
    percentage: 20,
    description: "Explain the role and function of network components like routers, switches, and firewalls.",
    topics: ["Routers & Switches", "TCP/UDP", "IPv4/IPv6", "Cabling types"],
    color: "bg-blue-500",
  },
  {
    id: "domain2",
    title: "Network Access",
    percentage: 20,
    description: "Configuring and verifying VLANs, STP, and EtherChannel on enterprise switches.",
    topics: ["VLANs", "Interswitch connectivity", "Layer 2 protocols", "AP Modes"],
    color: "bg-cyan-500",
  },
  {
    id: "domain3",
    title: "IP Connectivity",
    percentage: 25,
    description: "IP routing protocols including OSPFv2, static routing, and first hop redundancy protocols.",
    topics: ["Routing Table", "Static Routing", "OSPFv2", "FHRP"],
    color: "bg-indigo-500",
  },
  {
    id: "domain4",
    title: "IP Services",
    percentage: 10,
    description: "Configuring and verifying NAT, DHCP, DNS, and SNMP.",
    topics: ["NAT/PAT", "DHCP", "NTP", "SSH/Telnet"],
    color: "bg-teal-500",
  },
  {
    id: "domain5",
    title: "Security Fundamentals",
    percentage: 15,
    description: "Key security concepts, VPNs, access control lists, and wireless security.",
    topics: ["ACLs", "Site-to-site VPNs", "WPA2/WPA3", "Password policy"],
    color: "bg-red-500",
  },
  {
    id: "domain6",
    title: "Automation & Programmability",
    percentage: 10,
    description: "Comparing traditional networks with controller-based networking.",
    topics: ["Rest APIs", "JSON", "Puppet/Chef/Ansible", "DNA Center"],
    color: "bg-green-500",
  },
];

export const PRACTICE_QUESTIONS: Question[] = [
  {
    id: "q1",
    domainId: "domain1",
    text: "Which layer of the OSI model is responsible for logical addressing?",
    options: ["Physical", "Data Link", "Network", "Transport"],
    correctAnswer: 2,
    explanation: "The Network layer (Layer 3) handles logical addressing (IP addresses) and routing.",
    difficulty: "easy",
  },
  {
    id: "q2",
    domainId: "domain2",
    text: "What protocol is used to prevent loops in a Layer 2 network?",
    options: ["OSPF", "STP", "BGP", "RIP"],
    correctAnswer: 1,
    explanation: "Spanning Tree Protocol (STP) prevents bridge loops and the broadcast radiation that results from them.",
    difficulty: "easy",
  },
  {
    id: "q3",
    domainId: "domain3",
    text: "An engineer is configuring OSPFv2. What is the default administrative distance for OSPF?",
    options: ["90", "100", "110", "120"],
    correctAnswer: 2,
    explanation: "The Administrative Distance (AD) for OSPF is 110. EIGRP is 90, RIP is 120.",
    difficulty: "medium",
  },
  {
    id: "q4",
    domainId: "domain1",
    text: "Which of the following IPv6 addresses is a valid link-local address?",
    options: ["FE80::1", "2001:DB8::1", "FC00::1", "FF02::1"],
    correctAnswer: 0,
    explanation: "Link-local IPv6 addresses always start with FE80::/10.",
    difficulty: "medium",
  },
  {
    id: "q5",
    domainId: "domain5",
    text: "What type of ACL uses the range 100-199 in classic Cisco IOS?",
    options: ["Standard", "Extended", "Named", "Reflexive"],
    correctAnswer: 1,
    explanation: "Extended ACLs use numbers 100-199 and 2000-2699. Standard ACLs use 1-99 and 1300-1999.",
    difficulty: "medium",
  },
  {
    id: "q6",
    domainId: "domain6",
    text: "Which HTTP status code indicates that a REST API request was successful and a resource was created?",
    options: ["200 OK", "201 Created", "204 No Content", "400 Bad Request"],
    correctAnswer: 1,
    explanation: "201 Created is the specific success code for resource creation in RESTful APIs.",
    difficulty: "hard",
  },
  {
    id: "q7",
    domainId: "domain3",
    text: "A router receives a packet for 192.168.1.100. The routing table has 192.168.1.0/24 (Static) and 192.168.1.64/26 (OSPF). Which path is used?",
    options: ["The Static route (192.168.1.0/24)", "The OSPF route (192.168.1.64/26)", "The packet is dropped", "Both are used for load balancing"],
    correctAnswer: 1,
    explanation: "Routers always prefer the 'Longest Prefix Match'. /26 is a more specific match than /24 for the target IP.",
    difficulty: "hard",
  },
  {
    id: "q8",
    domainId: "domain2",
    text: "In Spanning Tree (802.1D), what is the port state where the port does not forward frames but still processes BPDUs?",
    options: ["Blocking", "Listening", "Learning", "Forwarding"],
    correctAnswer: 0,
    explanation: "In Blocking state, the port discards user data but still receives and processes BPDUs to detect network changes.",
    difficulty: "hard",
  },
  {
    id: "q9",
    domainId: "domain4",
    text: "Which protocol automatically assigns IP addresses to clients on a network?",
    options: ["DNS", "DHCP", "NTP", "SNMP"],
    correctAnswer: 1,
    explanation: "DHCP (Dynamic Host Configuration Protocol) is used to automatically assign IP addresses and other network parameters.",
    difficulty: "easy",
  },
  {
    id: "q10",
    domainId: "domain5",
    text: "Which of the following describes a site-to-site VPN?",
    options: ["Connects individual users to the corporate network", "Connects two entire branches or offices over the internet", "Encryption for web browsing only", "A direct physical cable between buildings"],
    correctAnswer: 1,
    explanation: "Site-to-site VPNs connect entire networks (like Branch A to Head Office) over an untrusted network like the internet.",
    difficulty: "medium",
  },
  {
    id: "q11",
    domainId: "domain1",
    text: "What is the result of the binary conversion of the decimal value 172?",
    options: ["10101100", "11001010", "10110000", "10101010"],
    correctAnswer: 0,
    explanation: "172 in binary is 10101100 (128 + 32 + 8 + 4 = 172).",
    difficulty: "medium",
  },
  {
    id: "q12",
    domainId: "domain2",
    text: "Which command would you use to see which ports are assigned to which VLANs?",
    options: ["show ip interface brief", "show vlan brief", "show interface status", "show running-config"],
    correctAnswer: 1,
    explanation: "'show vlan brief' (or 'show vlan') displays the VLAN database and port assignments.",
    difficulty: "easy",
  },
  {
    id: "q13",
    domainId: "domain3",
    text: "When configuring a floating static route, what do you change to make it the backup route?",
    options: ["Metric", "Administrative Distance", "Priority", "Weight"],
    correctAnswer: 1,
    explanation: "By increasing the Administrative Distance of a static route higher than the primary route (e.g., to 10), it becomes a 'floating' backup.",
    difficulty: "hard",
  },
  {
    id: "q14",
    domainId: "domain4",
    text: "Which NAT type maps a single inside local address to a single inside global address using a static entry?",
    options: ["Dynamic NAT", "Static NAT", "PAT", "Overload"],
    correctAnswer: 1,
    explanation: "Static NAT provides a 1-to-1 mapping that never changes, typically used for hosting internal servers.",
    difficulty: "medium",
  },
  {
    id: "q15",
    domainId: "domain6",
    text: "What does the term 'Northbound API' refer to in an SDN architecture?",
    options: ["Communication between controller and switches", "Communication between controller and applications", "Inter-controller communication", "CLI access to devices"],
    correctAnswer: 1,
    explanation: "Northbound APIs allow applications and management planes to communicate with the SDN controller.",
    difficulty: "hard",
  },
  {
    id: "q16",
    domainId: "domain1",
    text: "Which UTP cable category is required for 10GBASE-T up to 100 meters?",
    options: ["Cat 5e", "Cat 6", "Cat 6a", "Cat 3"],
    correctAnswer: 2,
    explanation: "Cat 6a (Augmented) is designed for 10 Gbps speeds at the full 100-meter distance.",
    difficulty: "medium",
  },
  {
    id: "q17",
    domainId: "domain5",
    text: "What is the primary purpose of Port Security on a Cisco switch?",
    options: ["Prevent spanning tree loops", "Restrict access based on MAC addresses", "Route traffic between VLANs", "Encrypt switch management traffic"],
    correctAnswer: 1,
    explanation: "Port Security limits the MAC addresses allowed to connect to a specific switch port.",
    difficulty: "easy",
  },
  {
    id: "q18",
    domainId: "domain2",
    text: "Which protocol provides First Hop Redundancy (FHRP) and is a Cisco proprietary protocol?",
    options: ["VRRP", "HSRP", "GLBP", "STP"],
    correctAnswer: 1,
    explanation: "HSRP (Hot Standby Router Protocol) is Cisco proprietary. VRRP is an open standard.",
    difficulty: "medium",
  },
  {
    id: "q19",
    domainId: "domain3",
    text: "What is the default aging time for an entry in the MAC address table of a Cisco switch?",
    options: ["60 seconds", "300 seconds", "1800 seconds", "Infinite"],
    correctAnswer: 1,
    explanation: "The default aging time is 300 seconds (5 minutes).",
    difficulty: "medium",
  },
  {
    id: "q20",
    domainId: "domain4",
    text: "Which command shows the translations currently active in a Cisco NAT-enabled router?",
    options: ["show nat translations", "show ip nat translations", "show ip statistics", "debug ip nat"],
    correctAnswer: 1,
    explanation: "'show ip nat translations' is the command to view the NAT translation table.",
    difficulty: "easy",
  },
  {
    id: "q21",
    domainId: "domain1",
    text: "What is the maximum distance for a Standard Ethernet cable (100BASE-TX)?",
    options: ["50 meters", "100 meters", "500 meters", "2 kilometers"],
    correctAnswer: 1,
    explanation: "Copper UTP Ethernet cables have a standard distance limit of 100 meters.",
    difficulty: "easy",
  },
];

export const LAB_CHALLENGES: LabChallenge[] = [
  {
    id: "challenge-1",
    title: "Basic Connectivity",
    difficulty: "easy",
    category: "topology",
    description: "Build a simple network to connect a PC to a Router.",
    tasks: [
      "Place 1 Router and 1 PC on the canvas.",
      "Connect them using an Ethernet link.",
      "Assign the Router the hostname 'GATEWAY-R1'.",
      "Verify the connection visually."
    ],
    tips: "Remember that in a real lab, you'd need a crossover cable for PC-to-Router if they don't support Auto-MDIX!"
  },
  {
    id: "challenge-2",
    title: "VLAN Segmentation",
    difficulty: "medium",
    category: "cli",
    description: "Configure basic VLANs on a switch to segment network traffic.",
    tasks: [
      "Enter global configuration mode.",
      "Create VLAN 10 and name it 'SALES'.",
      "Create VLAN 20 and name it 'ENG'.",
      "Verify the VLAN database with the appropriate show command."
    ],
    tips: "Use 'vlan <number>' then 'name <string>' to complete this."
  },
  {
    id: "challenge-3",
    title: "Layer 3 Routing",
    difficulty: "hard",
    category: "mixed",
    description: "Set up a routed connection between two departments.",
    tasks: [
      "Place 2 Routers and 2 Switches.",
      "Connect Router 1 to Switch 1, and Router 2 to Switch 2.",
      "Configure static routes so Router 1 can reach Router 2's network.",
      "Assign IP addresses to the interfaces: 192.168.1.1/24 and 10.0.0.1/24."
    ],
    tips: "Ensure all 'shutdown' interfaces are brought up with 'no shutdown'."
  },
  {
    id: "challenge-4",
    title: "EtherChannel (LACP)",
    difficulty: "medium",
    category: "cli",
    description: "Bundle multiple physical links into a single logical link using LACP.",
    tasks: [
      "Select two interfaces on Switch 1.",
      "Configure them as part of Channel-Group 1.",
      "Set the mode to 'active' for LACP negotiation.",
      "Verify the EtherChannel state with 'show etherchannel summary'."
    ],
    tips: "All ports in the bundle must have matching speeds, duplex, and VLAN settings."
  },
  {
    id: "challenge-5",
    title: "Port Security",
    difficulty: "easy",
    category: "cli",
    description: "Secure switch access ports by limiting the number of allowed MAC addresses.",
    tasks: [
      "Select an access port (e.g., FastEthernet 0/1).",
      "Enable port security with 'switchport port-security'.",
      "Set the maximum number of MAC addresses to 1.",
      "Configure the violation mode to 'shutdown' or 'restrict'."
    ],
    tips: "You may need to toggle the 'switchport mode access' command first."
  },
  {
    id: "challenge-6",
    title: "OSPFv2 Single-Area",
    difficulty: "medium",
    category: "cli",
    description: "Configure dynamic routing using OSPF in a single area (Area 0).",
    tasks: [
      "Enable OSPF with 'router ospf 1'.",
      "Assign a unique Router ID.",
      "Advertise the local subnets using the 'network' command with wildcard masks.",
      "Verify adjacency with 'show ip ospf neighbor'."
    ],
    tips: "The wildcard mask for a /24 network is 0.0.0.255."
  },
  {
    id: "challenge-7",
    title: "DHCP Server Config",
    difficulty: "medium",
    category: "cli",
    description: "Configure a Cisco Router to act as a DHCP server for local clients.",
    tasks: [
      "Exclude addresses meant for static assignment (e.g., the default gateway).",
      "Create a DHCP pool named 'LAN-POOL'.",
      "Specify the network range and default router.",
      "Configure a DNS server address (e.g., 8.8.8.8)."
    ],
    tips: "Use 'ip dhcp excluded-address' before defining the pool."
  },
  {
    id: "challenge-8",
    title: "Standard IPv4 ACLs",
    difficulty: "hard",
    category: "cli",
    description: "Implement simple traffic filtering using numbered or named standard ACLs.",
    tasks: [
      "Create an ACL to 'permit' a specific host and 'deny' others.",
      "Apply the ACL to the correct interface and direction (in/out).",
      "Verify matches with 'show access-lists'.",
      "Test connectivity to see if filtering occurs as expected."
    ],
    tips: "Standard ACLs should generally be placed as close to the destination as possible."
  }
];
