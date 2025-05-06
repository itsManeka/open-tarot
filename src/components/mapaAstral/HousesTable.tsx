import { Houses, Stars } from '../../types/astrologicalChartsTypes';
import { StringHelper } from '../../utils/stringHelper';
import ShareableWrapper from '../ShareableWrapper';

import './styles/HousesTable.css'

interface HousesTableProps {
    stars: Stars[];
    houses: Houses[];
}

export function HousesTable({stars, houses} : HousesTableProps) {
    const HouseIcon = ({ number }: { number: number }) => (
        <svg className="houses-table-star-img" width="50" height="50" xmlns="http://www.w3.org/2000/svg">
            <title>Casa {number}</title>
            <circle cx="25" cy="25" r="20" fill="#bb86fc" />
            <text x="50%" y="50%" textAnchor="middle" fill="#121212" fontSize="18px" fontWeight="bold" dy=".3em">
                C{number}
            </text>
        </svg>
    );

    const anglePoints = (stars || []).filter((a) => a.classificacao === "Pontos Angulares");

    return(
        <ShareableWrapper
            title='Mapa Astral'
            text='Casas'
        >
            <div className="houses-table">
                <h2 className="houses-table-title">Casas</h2>
                <div className='houses-table-sign-section'>
                    {anglePoints.map(({signo, nome}) => (
                        <div key={nome} className='houses-table-sign-box' data-snapshot-img="download">
                            <img className="houses-table-sign-box-img" src={`/assets/signos/${StringHelper.strNormalize(signo).toLowerCase()}.svg`} />
                            <div className='houses-table-sign-box-text a'>
                                {signo}<br/>
                            </div>
                            <div className='houses-table-sign-box-text b'>
                                {nome}
                            </div>
                        </div>
                    ))}
                </div>
                {houses.map(({ casa, grau, signo }) => (
                    <div key={casa} className='houses-table-section'>
                        <div className="houses-table-section-item-box">
                            <HouseIcon number={casa} />
                            <div className="houses-table-section-item house" data-snapshot-img="download">
                                <img className="houses-table-sign-img" src={`/assets/signos/${StringHelper.strNormalize(signo).toLowerCase()}.svg`} />
                                {signo}
                            </div>
                            <div className="houses-table-section-item">
                                {StringHelper.formatSignPosition(grau)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ShareableWrapper>
    );
}