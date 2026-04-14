"use client";

// Smartlink - 点击时可能显示广告，然后跳转到目标页面
// 用法：包裹普通链接，用户点击时有机会看到广告

interface SmartlinkProps {
  href: string;  // 最终跳转的目标页面
  className?: string;
  children: React.ReactNode;
}

export function Smartlink({ href, className, children }: SmartlinkProps) {
  const smartlinkUrl = "https://developdomicile.com/cgfzstgbwy?key=55b7f459c07f4e222cc1247f35482b27";

  // 点击时先尝试 Smartlink，然后正常跳转
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 打开 Smartlink（在新标签页）
    window.open(smartlinkUrl, '_blank');
    // 然后正常导航到目标页面
    // 如果 href 是内部链接，让默认行为处理
  };

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

// 直接 Smartlink（没有目标页面，纯广告链接）
export function DirectSmartlink({ className, children }: { className?: string; children: React.ReactNode }) {
  const smartlinkUrl = "https://developdomicile.com/cgfzstgbwy?key=55b7f459c07f4e222cc1247f35482b27";

  return (
    <a
      href={smartlinkUrl}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}