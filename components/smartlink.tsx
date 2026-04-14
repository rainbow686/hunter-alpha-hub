"use client";

// Smartlink - Adsterra 智能链接
// 用于外部链接或专门的广告按钮区域

const SMARTLINK_URL = "https://developdomicile.com/cgfzstgbwy?key=55b7f459c07f4e222cc1247f35482b27";

interface SmartlinkButtonProps {
  className?: string;
  children: React.ReactNode;
}

// 专门的广告按钮 - 点击跳转到 Smartlink
export function SmartlinkButton({ className, children }: SmartlinkButtonProps) {
  return (
    <a
      href={SMARTLINK_URL}
      className={className}
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      {children}
    </a>
  );
}

// 外部链接 + Smartlink - 先打开 Smartlink，再打开目标链接
// 用于如 OpenRouter 等外部链接
interface ExternalLinkWithSmartlinkProps {
  href: string;  // 最终目标外部链接
  className?: string;
  children: React.ReactNode;
}

export function ExternalLinkWithSmartlink({ href, className, children }: ExternalLinkWithSmartlinkProps) {
  const handleClick = () => {
    // 先打开 Smartlink（新标签）
    window.open(SMARTLINK_URL, '_blank', 'noopener,noreferrer');
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