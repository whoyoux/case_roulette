import crypto from 'crypto';

function getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

const getSHA256 = () => {
    const hash = crypto.createHash('sha256').digest('hex');
    return hash;
}

export { getSHA256, getRandomArbitrary }
