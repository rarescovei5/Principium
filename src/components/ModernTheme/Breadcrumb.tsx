import { Link, LinkProps } from 'react-router-dom';

/**
 * IMPORTANT: You need the `react-router-dom` dependency for this component to work!
 * This is required for navigation and link handling within the app.
 */

// ────────────────────────────────────────────────────────────────
// COMPONENTS
// ────────────────────────────────────────────────────────────────

const Breadcrumb = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLOListElement>) => {
  return (
    <nav>
      <ol className={'inline-flex gap-4 items-center' + className} {...props}>
        {children}
      </ol>
    </nav>
  );
};

const BreadcrumbLink = ({
  children,
  to,
  className = '',
  ...props
}: LinkProps) => {
  return (
    <>
      <li>
        <Link
          to={to}
          className={
            'p text-subtext transition-colors duration-150 hover:text-white ' +
            className
          }
          {...props}
        >
          {children}
        </Link>
      </li>
      <li>
        <svg
          className="w-2 -rotate-90"
          viewBox="0 0 8 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.75078 3.90553L0.0950727 0.511126C0.0340446 0.454488 0 0.379241 0 0.300992C0 0.222744 0.0340446 0.147497 0.0950727 0.0908601L0.0992035 0.0872054C0.128789 0.0596535 0.1644 0.0377147 0.203871 0.022723C0.243343 0.0077312 0.285849 2.38419e-07 0.328804 2.38419e-07C0.371759 2.38419e-07 0.414265 0.0077312 0.453736 0.022723C0.493207 0.0377147 0.528819 0.0596535 0.558404 0.0872054L4.00069 3.28366L7.4416 0.0872054C7.47118 0.0596535 7.50679 0.0377147 7.54626 0.022723C7.58573 0.0077312 7.62824 2.38419e-07 7.6712 2.38419e-07C7.71415 2.38419e-07 7.75666 0.0077312 7.79613 0.022723C7.8356 0.0377147 7.87121 0.0596535 7.9008 0.0872054L7.90493 0.0908601C7.96596 0.147497 8 0.222744 8 0.300992C8 0.379241 7.96596 0.454488 7.90493 0.511126L4.24922 3.90553C4.21707 3.93538 4.17841 3.95915 4.13557 3.97539C4.09273 3.99163 4.04661 4 4 4C3.95339 4 3.90727 3.99163 3.86443 3.97539C3.82159 3.95915 3.78293 3.93538 3.75078 3.90553Z"
            fill="#999999"
          />
        </svg>
      </li>
    </>
  );
};

const BreadcrumbHead = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & {}) => {
  return (
    <li>
      <p className="p" {...props}>
        {children}
      </p>
    </li>
  );
};

export { Breadcrumb, BreadcrumbHead, BreadcrumbLink };
