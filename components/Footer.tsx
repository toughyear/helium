import React from 'react';

function Footer() {
    return (
        <footer className="mt-auto flex w-full justify-center border-t border-t-foreground/10 p-8 text-center text-xs">
            <p>
                Powered by{' '}
                <a
                    href="https://ajeevnaruka.com/projects"
                    target="_blank"
                    className="font-bold hover:underline"
                >
                    Helium AI
                </a>
            </p>
        </footer>
    );
}

export default Footer;
