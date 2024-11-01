import express from "express";

const router = express.Router();

const moduleRoutes = [
  /* {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/cows",
    route: CowRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  }, */
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
