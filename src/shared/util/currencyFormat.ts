export default function currencyFormat(number: number) {
	return `$ ${new Intl.NumberFormat('de-DE').format(Math.trunc(number))}`;
}
