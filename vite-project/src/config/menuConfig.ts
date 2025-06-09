const menuList = [
    {
        title: "首页",
        index: "/home",
        icon: "House",
        isPublic: true,
    },
    {
        title: "用户管理",
        index: "/user",
        icon: "User",
    },
    {
        title: "角色管理",
        index: "/role",
        icon: "ChatLineSquare",
    },
    {
        title: "学员",
        index: "/students",
        icon: "UserFilled",
        children: [
            {
                title: "学校管理",
                index: "/school",
                icon: "School",
            },
            {
                title: "专业管理",
                index: "/major",
                icon: "Calendar",
            },
            {
                title: "班级管理",
                index: "/class",
                icon: "Timer",
            },
            {
                title: "学员管理",
                index: "/student",
                icon: "MoreFilled",
            },
        ],
    },
];

// 对外保留
export default menuList
