import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '../components/ModernTheme/NavigationMenu';
import { Button } from '../components/ModernTheme/Button';

const Navbar = () => {
  return (
    <nav className="text-white mx-40 max-md:mx-auto max-md:w-[90%] mt-2 flex justify-between items-center">
      <div className="flex-1">
        <h3 className="h3 max-md:hidden">Principium</h3>
        <p className="p md:hidden">Principium</p>
      </div>
      <div className="flex-1 gird place-items-center">
        <NavigationMenu>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 w-2xl max-md:w-[400px] max-lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-surface p-6 no-underline outline-none focus:shadow-md"
                    to="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Principium Website Builder
                    </div>
                    <p className="p text-subtext">
                      Quickly build custom startup demos with React components,
                      themes, and more. Accessible, customizable, and
                      open-source.
                    </p>
                  </Link>
                </li>
                <li>
                  <NavigationMenuLink to="/docs">
                    <p className="p">Getting Started</p>
                    <p className="p text-subtext">
                      Learn how to set up and create your first demo with
                      Principium.
                    </p>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink to="/installation">
                    <p className="p">Components & Templates</p>
                    <p className="p text-subtext">
                      Explore reusable components and templates to speed up your
                      build.
                    </p>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink to="/typography">
                    <p className="p">Typography & Styles</p>
                    <p className="p text-subtext">
                      Access predefined styles for text, headings, and more.
                    </p>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Apps</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 w-2xl max-md:w-[400px] max-lg:w-[500px] lg:grid-cols-2">
                <li>
                  <NavigationMenuLink to="/docs">
                    <p className="p">App 1</p>
                    <p className="p text-subtext">
                      Lorem cupidatat ex ad labore sunt elit consectetur veniam
                      sunt occaecat.
                    </p>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink to="/installation">
                    <p className="p">App 2</p>
                    <p className="p text-subtext">
                      Consectetur consectetur et esse qui sint officia sint sunt
                      labore velit magna fugiat magna.
                    </p>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink to="/typography">
                    <p className="p">App 3</p>
                    <p className="p text-subtext">
                      Laborum ullamco labore nulla commodo consequat ad id
                      officia dolor minim in est.
                    </p>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink to="/typography">
                    <p className="p">App 4</p>
                    <p className="p text-subtext">
                      Do amet id ad cillum cillum Lorem minim occaecat ipsum
                      dolor tempor eu Lorem.
                    </p>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to={'/ui'}>
              <Button variant="ghost">Components</Button>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuViewport />
        </NavigationMenu>
      </div>
      <div className="flex gap-2 flex-1 justify-end">
        <Link to={'login'}>
          <Button variant="secondary">Login</Button>
        </Link>
        <Link to={'register'}>
          <Button>Register</Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
