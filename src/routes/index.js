import {
  Home,
  Following,
  Search,
  VideoComments,
} from "../components/pages/publicPages";
import { Profile, Upload } from "../components/pages/privatePages";
const publicRoutes = [
  { path: "/", component: Home },
  { path: "/following", component: Following },
  { path: "/search", component: Search },
  { path: "/videoComments/:idVideo", component: VideoComments, layout: null },
];
const privateRoutes = [
  { path: "/profile/:author", component: Profile },
  { path: "/upload", component: Upload },
];
export { privateRoutes, publicRoutes };
